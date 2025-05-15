interface ResponseProps {
  message: string;
  onClose: () => void;
}

const AI: React.FC<ResponseProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-20 left-1/4 w-1/2 h-1/2 bg-green-100 border border-gray-400 shadow-xl rounded-md z-50 overflow-hidden flex flex-col">
      <div className="bg-green-200 border-b border-gray-300 px-4 py-2 flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-800">Nova AI</h2>
        <button
          onClick={onClose}
          className="text-red-600 font-bold cursor-pointer text-xl hover:text-red-800"
        >
          ×
        </button>
      </div>
      <div className="p-4 overflow-auto">
        <p className="whitespace-pre-wrap font-lg text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default AI;
