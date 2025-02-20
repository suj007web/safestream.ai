#@title Model
from attenctionCNN import attentiveConv
import torch
import torch.nn as nn
from torchvision import models
from sklearn.utils import shuffle


class AttentionCNN(nn.Module):
  def __init__(self):
    super().__init__()

    self.basenet = torch.nn.Sequential(*list(models.mobilenet_v3_small(weights = models.MobileNet_V3_Small_Weights.DEFAULT).children())[:-1])
    self.attention = attentiveConv(576, 288, 3, dk=2*288, dv=int(0.5*288), nh=8, relative=True)
    self.act1 = nn.ReLU()
    self.bn = nn.BatchNorm2d(288)

    self.fc1 = nn.Linear(288, 64)
    self.act2 = nn.ReLU()
    self.fc2 = nn.Linear(64, 3)
    # self.act3 = nn.Sigmoid()

  def forward(self, x):

    x = self.basenet(x)
    x = self.attention(x)
    x = self.act1(x)
    x = self.bn(x)

    x = x.view(x.size()[0], -1)
    x = self.fc1(x)
    x = self.act2(x)
    x = self.fc2(x)
    # x = self.act3(x)

    return x