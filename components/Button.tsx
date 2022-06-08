interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  return (
    <button
      className="text-xs bg-violet-400 rounded-md p-2
      text-white hover:bg-violet-600 transition-colors"
    >
      {text}
    </button>
  );
}
