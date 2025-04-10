// filepath: Frontend/src/components/MessageInput.jsx
import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const [sendToAI, setSendToAI] = useState(false); // Add this line

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    // Check image size before sending
    if (imagePreview) {
      // Convert base64 to bytes and check size
      const base64Length = imagePreview.split(',')[1].length;
      const sizeInBytes = base64Length * 0.75; // Convert base64 length to bytes
      const MAX_SIZE = 1 * 1024 * 1024; // 1MB limit
      if (sizeInBytes > MAX_SIZE) {
        toast.error("Image size is too large");
        return;
      }
    }

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        isAI: sendToAI,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        {/* Add a toggle switch for sending to AI */}
        <label className="swap swap-rotate">
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" className="hidden" onChange={() => setSendToAI(!sendToAI)} />

          {/* AI icon */}
          <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.999 18.999a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-2a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-12.979c-4.409 0-8 3.591-8 8s3.591 8 8 8 8-3.591 8-8-3.591-8-8-8zm5.293 6.293-1.414 1.414-2.829-2.828 1.415-1.414 2.828 2.828zm-10.586 0 1.414 1.414 2.829-2.828-1.415-1.414-2.828 2.828z" /></svg>
          {/* User Icon */}
          <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 4a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm0 6c-2.67 0-8 1.34-8 4v4h16v-4c0-2.66-5.33-4-8-4z" /></svg>
        </label>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;