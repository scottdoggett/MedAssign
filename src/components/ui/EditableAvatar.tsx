"use client";

import React, { useState, useEffect } from "react";
import { StaffMember } from "@/context/StaffContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react"; // Edit icon

interface EditableAvatarProps {
  member: StaffMember;
}

const EditableAvatar: React.FC<EditableAvatarProps> = ({ member }) => {
  const [hovered, setHovered] = useState(false);
  const [image, setImage] = useState("");

  // ✅ Ensure image loads correctly on the client
  useEffect(() => {
    setImage(`/headshots/${member.ID}.jpeg`);
  }, [member.ID]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", member.ID.toString());

    try {
      const response = await fetch("/api/uploadAvatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      // ✅ Force image refresh
      setTimeout(() => {
        setImage(`/headshots/${member.ID}.jpeg?timestamp=${Date.now()}`);
      }, 100);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div
      className="relative w-32 h-32"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Avatar className="w-32 h-32">
        <AvatarImage key={image} src={image} alt={member.Name} />
        <AvatarFallback>{member.Name[0]}</AvatarFallback>
      </Avatar>

      {hovered && (
        <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer">
          <Pencil className="w-8 h-8 text-white" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      )}
    </div>
  );
};

export default EditableAvatar;
