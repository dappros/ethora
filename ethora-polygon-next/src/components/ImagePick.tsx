import { PhotoIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useRef, useState, useEffect } from "react";


type FilesMap = Record<number, File>

type TypeProps = {
  setFiles: (File) => void
  files: FilesMap
  index: number
}

export function ImagePick(props: TypeProps) {
  const imageRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState("");
  const [addressesAmount, setAddressesAmount] = useState(0);

  useEffect(() => {
    if (preview) {
      previewRef.current.style.backgroundImage = `url(${preview})`;
    }
  }, [preview]);

  const chooseImage = () => {
    imageRef.current.click();
  };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setSelectedFile(e.target.files[0]);
    props.setFiles({...props.files, ...{[props.index]: e.target.files[0]}})
    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setPreview(objectUrl);
  };

  const onRemoveImage = () => {
    setPreview("")
    props.setFiles({...props.files, ...{[props.index]: null}})
  }

  return (
    <div className="w-[350px] mb-4 relative  hover:bg-gray-300 cursor-pointer  rounded-lg border-dashed h-[257px] border">
      {preview && (
        <div
          ref={previewRef}
          className="absolute bg-cover bg-center top-0 left-0 right-0 bottom-0"
        >
          <button
            onClick={onRemoveImage}
            className="bg-white rounded-full absolute right-[10px] top-[10px]"
          >
            <XMarkIcon className="w-[24px] h-[24px]" />
          </button>
        </div>
      )}
      <div
        className="h-full w-full flex items-center justify-center border"
        onClick={chooseImage}
      >
        <input
          accept="image/*"
          ref={imageRef}
          onChange={onSelectFile}
          type="file"
          className="hidden"
        ></input>
        <PhotoIcon className="h-[80px] w-[80px text-gray-400" />
      </div>
    </div>
  );
}
