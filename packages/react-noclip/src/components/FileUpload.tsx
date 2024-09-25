import { FileIcon } from "lucide-react";
import { FileUpload } from "@ark-ui/react";
import styled from "@emotion/styled";

export const FilePicker = ({ id }: { id?: string }) => {
  return (
    <Root maxFiles={1}>
      <FileUpload.Dropzone>
        <FileUpload.Label htmlFor={id}>File Upload</FileUpload.Label>
      </FileUpload.Dropzone>
      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <FileUpload.Item key={file.name} file={file}>
                <FileUpload.ItemPreview type="image/*">
                  <FileUpload.ItemPreviewImage />
                </FileUpload.ItemPreview>
                <FileUpload.ItemPreview type=".*">
                  <FileIcon />
                </FileUpload.ItemPreview>
                <FileUpload.ItemName />
                <FileUpload.ItemSizeText />
                <FileUpload.ItemDeleteTrigger>X</FileUpload.ItemDeleteTrigger>
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>
      <FileUpload.HiddenInput id={id} name={id} />
    </Root>
  );
};

const Root = styled(FileUpload.Root)`
  [aria-label="dropzone"] {
    border: 1px solid var(--gray9);
    min-height: 32px;
    border-radius: 4px;
    text-align: center;
    background: var(--gray3);

    &:hover {
      background: var(--gray4);
    }
  }
  label {
    display: block;
    width: 100%;
    cursor: pointer;
  }
  input {
    display: none;
  }
  ul {
    background: var(--gray3);
    margin: 8px 0;
    display: flex;
    flex-direction: column;
    padding: 0;
    border-radius: 4px;
    li {
      list-style-type: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0;
      margin: 0;

      font-size: 12px;
      color: var(--gray11);
      line-height: 32px;
      letter-spacing: 0.2px;
      div:nth-of-type(1) {
        flex: 1;
        padding: 4px;
        display: flex;
        align-items: center;
        width: 32px;
        height: 32px;
        margin-left: 4px;
        svg {
          width: 18px;
        }
      }
      div:nth-of-type(2) {
        flex: 6;
      }
      div:nth-of-type(3) {
        flex: auto;
        text-align: right;
      }
      button {
        flex: 1;
        aspect-ratio: 1;
      }
      div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    &:empty {
      display: none;
    }
  }
`;
