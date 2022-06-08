import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  name: string;
  isPassword?: boolean;
  register?: UseFormRegisterReturn;
}

interface ImageInputProps {
  name: string;
  register?: UseFormRegisterReturn;
  previewUrl?: string;
}

export function Input({ name, isPassword, register }: InputProps) {
  return (
    <div className="flex flex-col space-y-2">
      <span className="text-xs">{name}</span>

      <input
        className="focus:outline-none focus:border-violet-400 border-2 border-gray-200 rounded-md pl-1.5"
        type={isPassword ? "password" : "text"}
        {...register}
      />
    </div>
  );
}

export function TimeInput({ name, register }: InputProps) {
  return (
    <div className="flex flex-col space-y-2">
      <span className="text-xs">{name}</span>
      <div className="flex w-full justify-center">
        <input
          className="w-full focus:outline-none focus:border-violet-400 border-2 border-gray-200 rounded-md pl-1.5"
          type="time"
        />
        <span className="mx-8">-</span>
        <input
          className="w-full focus:outline-none focus:border-violet-400 border-2 border-gray-200 rounded-md pl-1.5"
          type="time"
          {...register}
        />
      </div>
    </div>
  );
}

export function ImageInput({ name, register, previewUrl }: ImageInputProps) {
  return (
    <div className="flex flex-col space-y-2">
      <span className="text-xs">{name}</span>
      <label className="border-2 flex justify-center items-center rounded-md cursor-pointer text-violet-300 border-violet-200 border-md h-48">
        {previewUrl ? (
          <img src={previewUrl} className="h-48" />
        ) : (
          <svg
            className="w-12 h-12"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            ></path>
          </svg>
        )}
        <input type="file" className="hidden" {...register} />
      </label>
    </div>
  );
}
