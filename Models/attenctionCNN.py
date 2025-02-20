#@title Attention Module

import torch
import torch.nn as nn
from sklearn.utils import shuffle

device = torch.device('cpu')

class attentiveConv(nn.Module):
  """
     Perfoms multihead attention.
     Args:
      in_channels : (Tensor) Image with dimensions [batch, channels, height, width].
      out_channls : (int) Number of output filters.
      k_size: (int) Kernel size.
      dk: (int) Depth of queries and keys in multihead attention.
      dv: (int) Depth of values.
      nh: (int) Number of heads.
      relative: (bool) True for relative positional encodings.
     Return:
      (tensor) Attention augmented convolution.
  """
  def __init__(self, in_channels, out_channels, k_size, dk, dv, nh, relative=False):
    super(attentiveConv, self).__init__()
    self.f_in = in_channels
    self.f_out = out_channels
    self.k = k_size
    self.dk = dk
    self.dv = dv
    self.nh = nh
    self.relative = relative

    assert self.nh != 0, "nh must be equal or greater than 1"
    assert self.dk % self.nh == 0, "dk must be divisible by nh"
    assert self.dv % self.nh == 0, "dv must be divisible by nh"

    self.conv_out = nn.Conv2d(self.f_in, out_channels=self.f_out-self.dv, kernel_size=self.k, padding=(self.k-1)//2)
    self.qkv_conv = nn.Conv2d(self.f_in, out_channels= 2*self.dk+self.dv, kernel_size=self.k, padding=(self.k-1)//2)
    self.attn_out = nn.Conv2d(self.dv, self.dv, kernel_size=1)

  def forward(self, x):
    conv_out = self.conv_out(x)
    B, _, H, W = conv_out.size()

    #print(conv_out.size())
    flat_q, flat_k, flat_v, q = self.compute_flat_qkv(x, self.dk, self.dv, self.nh)
    logits = torch.matmul(flat_q.transpose(2, 3), flat_k)
    if self.relative:
      h_rel_logits, w_rel_logits = self.relative_logits(q)
      logits += h_rel_logits
      logits += w_rel_logits
    weights = nn.functional.softmax(logits, dim=-1)
    attn_out = torch.matmul(weights, flat_v.transpose(2, 3))
    # Reshaped into a tensor (H,W, dv) to match the original spatial dimensions.
    attn_out = torch.reshape(attn_out, (B, self.nh, self.dv // self.nh, H, W))
    attn_out = self.combine_heads_2d(attn_out)
    attn_out = self.attn_out(attn_out)

    flat_q, flatk_k, flat_v, q = None, None, None, None
    # Returns an attention augmented convolution
    return torch.cat((conv_out, attn_out), dim=1)

  def split_heads_2d(self, x, nh):
    """
      Splits channels into multiple heads.
    """
    B, C, H, W = x.size()
    ret_shape = (B, nh, C // nh, H, W)
    return torch.reshape(x, ret_shape)

  def combine_heads_2d(self, x):
    """
      Combine miltiple heads.
    """
    B, nh, dv, H, W = x.size()
    ret_shape = (B, nh*dv, H, W)
    return torch.reshape(x, ret_shape)

  def compute_flat_qkv(self, x, dk, dv, nh):
    """
      Computes flattenend queries, keys, and values.
    """
    qkv = self.qkv_conv(x)
    B, _, H, W = qkv.size()
    q, k, v = torch.split(qkv, [dk, dk, dv], dim=1)
    q = self.split_heads_2d(q, nh)
    k = self.split_heads_2d(k, nh)
    v = self.split_heads_2d(v, nh)
    dkh = dk // nh
    q = q * (dkh**-0.5)
    flat_q = torch.reshape(q, (B, nh, dk // nh, H*W))
    flat_k = torch.reshape(k, (B, nh, dk // nh, H*W))
    flat_v = torch.reshape(v, (B, nh, dv // nh, H*W))
    return flat_q, flat_k, flat_v, q

  def rel_to_abs(self, x):
    """
      Convert tensor from relative to absolute indexing.
    """
    B, nh, L, _ = x.size()
    col_pad = torch.zeros((B, nh, L, 1)).to(x)
    x = torch.cat((x, col_pad), dim=3)
    flat_x = torch.reshape(x, (B, nh, L*2*L))
    flat_pad = torch.zeros((B, nh, L-1)).to(x)
    flat_x_padded = torch.cat((flat_x, flat_pad), dim=2)
    final_x = torch.reshape(flat_x_padded, (B, nh, L+1, 2*L-1))
    return final_x[:, :, :L, L-1:]

  def relative_logits_1d(self, q, rel_k, H, W, nh, case):
    """
      Computes relative logits alonge one dimension.
    """
    rel_logits = torch.einsum('bhxyd,md->bhxym', q, rel_k)
    rel_logits = torch.reshape(rel_logits, (-1, nh*H, W, 2*W-1))
    rel_logits = self.rel_to_abs(rel_logits)

    rel_logits = torch.reshape(rel_logits, (-1, nh, H, W, W))
    rel_logits = torch.unsqueeze(rel_logits, dim=3)
    rel_logits = rel_logits.repeat((1, 1, 1, H, 1, 1))

    if case == "w":
      rel_logits = torch.transpose(rel_logits, 3, 4)
    elif case == "h":
      rel_logits = torch.transpose(rel_logits, 2, 4).transpose(4, 5).transpose(3, 5)
    return torch.reshape(rel_logits, (-1, nh, H*W, H*W))

  def relative_logits(self, q):
    """
      Computes relative positions logits.
    """
    B, nh, dk, H, W = q.size()
    q = torch.transpose(q, 2, 4).transpose(2, 3)
    key_rel_w = nn.Parameter(torch.randn((2*W-1, dk), requires_grad=True)).to(device) # Send to device
    rel_logits_w = self.relative_logits_1d(q, key_rel_w, H, W, nh, "w")

    key_rel_h = nn.Parameter(torch.randn((2*H-1, dk), requires_grad=True)).to(device) # Send to device
    rel_logits_h = self.relative_logits_1d(torch.transpose(q, 2, 3), key_rel_h, W, H, nh, "h")
    return rel_logits_h, rel_logits_w