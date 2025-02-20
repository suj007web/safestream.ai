from model import AttentionCNN
import torchvision.transforms as transforms
from PIL import Image
import torch
from torchvision import transforms


model = AttentionCNN()
model.load_state_dict(torch.load('./AACN.pth',map_location=torch.device('cpu')))
model.eval()
device = torch.device('cpu')
model.to(device)

# Your frame classification model setup goes here
def VideoFrameClassification(image):
    
    pil_image = Image.fromarray(image)

    # Convert the PIL image to RGB format if needed
    if pil_image.mode != 'RGB':
        pil_image = pil_image.convert('RGB')
    # Define the transforms
    transform = transforms.Compose([
        transforms.Resize((224, 224)),  # Resize the image
        transforms.ToTensor(),  # Convert the image to a tensor
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # Normalize the image
    ])

    # Apply the transforms
    input_tensor = transform(pil_image)
    # print(input_tensor)

    with torch.no_grad():
      output = model(input_tensor.unsqueeze(0))
    # print(output)
    # output=torch.round(output)
    _, predicted = torch.max(output, 1)
    # print(predicted)
    predicted=predicted.detach().cpu().numpy().flatten()
    
    return int(predicted)