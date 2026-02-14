# ML Models Directory

This directory is for ONNX model files used for edge inference.

## Required Models

| Model     | File             | Size    | Purpose             |
| --------- | ---------------- | ------- | ------------------- |
| SAM ViT-B | `sam-vit-b.onnx` | ~375 MB | Wound segmentation  |
| ZoE-Depth | `zoe-depth.onnx` | ~330 MB | 3D depth estimation |

## Setup

1. Download models from Hugging Face:
   - SAM: `https://huggingface.co/models/sam-vit-b`
   - ZoE: `https://huggingface.co/models/zoe-depth`

2. Convert to ONNX format if needed
3. Place `.onnx` files in this directory

## Note

The application works without these models – it falls back to mock inference for the hackathon demo.
In production, these models run client-side via ONNX Runtime Web for edge inference on smartphones.
