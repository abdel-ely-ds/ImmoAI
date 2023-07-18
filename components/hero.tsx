"use client";

import React, { useState, useRef, useEffect } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { BsPersonCircle } from "react-icons/bs";
import { BsRobot } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { MdOutlineCopyAll } from "react-icons/md";

interface Chat {
  text: string;
  response: string;
}

export default function Hero() {
  const [text, setText] = useState("");
  const [editedText, setEditedText] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const chatContainer = useRef<HTMLDivElement>(null);
  const [editIndex, setEditIndex] = useState(-1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/immo?question=${text}`
      );
      const jsonData = await response.json();
      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        updatedChats[prevChats.length - 1].response = jsonData;
        setLoading(false);
        return updatedChats;
      });
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleTextChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setText(event.target.value);
  };

  const handleEditedTextChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setEditedText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && text.trim() !== "") {
      event.preventDefault();
      handleClick();
    }
  };

  const handleClick = () => {
    if (!buttonClicked) {
      setButtonClicked(true);
    }
    // Store the sent text and an empty response initially
    setChats((prevChats) => [...prevChats, { text: text, response: "" }]);

    fetchData();
    setText("");
  };

  const handleSave = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log(text);
    console.log(event.target.value);
    if (event.target.value.trim() !== text) {
      setChats(chats.slice(0, index + 1));
    }
    setEditIndex(-1);
  };

  const handleCancel = () => {
    setEditIndex(-1);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
  };

  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  }, [chats]);

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div
          className={`${
            buttonClicked
              ? "pt-16 md:pt-20 md:pb-10 md:mb-5 sm:mb-5"
              : "pt-32 md:pt-20 lg:pb-10 lg:pt-60"
          }`}
        >
          <div className="text-center pb-2 md:pb-3 lg:pb-4">
            <h1
              className={`font-extrabold leading-tighter tracking-tighter mb-4 ${
                buttonClicked
                  ? "text-3xl  md:text-4xl lg:text-5xl"
                  : "text-4xl md:text-6xl lg:text-6xl"
              }`}
            >
              ImmoGPT
            </h1>
            <div className="max-w-4xl mx-auto">
              <p
                className={` text-black-900 ${
                  buttonClicked
                    ? "text-lg  md:text-xl lg:text-2xl"
                    : "text-1xl md:text-3xl lg:text-3xl"
                }`}
              >
                Search you dream house, ask for prices, market trends using
                natural language.
              </p>
            </div>
          </div>
        </div>

        {chats.length > 0 && (
          <div
            className=" text-black-900 text-sm md:text-base lg:text-lg max-h-[60vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 "
            ref={chatContainer}
          >
            {chats.map((chat, index) => (
              <div key={index}>
                <div className="flex items-center bg-[#d8c6ab] p-4 min-h-[40px] pt-3 group">
                  <BsPersonCircle className="text-2xl mr-4 text-[#3e0f68] md:text-3xl" />
                  {editIndex === index ? (
                    <>
                      <textarea
                        value={chat.text}
                        onChange={handleEditedTextChange}
                        placeholder="Ask any question about real estate."
                        className="text-sm w-4/5 h-10 border-none focus:ring-0 p-auto resize-none bg-[#d8c6ab] overflow-hidden md:text-base lg:text-lg"
                      />
                    </>
                  ) : (
                    <p className="flex-grow">{chat.text}</p>
                  )}

                  <div>
                    {editIndex === index ? (
                      <>
                        <button
                          onClick={(event) => handleSave(index, event)}
                          className="mr-2 bg-[#3e0f68] p-2 rounded text-white"
                        >
                          Save
                        </button>
                        <button onClick={handleCancel}>Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => handleEdit(index)}>
                        <FiEdit className="group-hover:flex hidden" />
                      </button>
                    )}
                  </div>
                </div>
                {chat.response && (
                  <div className="flex items-center p-4 min-h-[40px] pt-3">
                    <BsRobot className="text-2xl mr-4 text-[#216DE3] md:text-3xl" />
                    <p className="flex-grow">{chat.response}</p>
                    <button>
                      <MdOutlineCopyAll className="mr-2 " />
                    </button>
                    <button>
                      <FaRegThumbsUp className="mr-2" />
                    </button>
                    <button>
                      <FaRegThumbsDown />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div
          className={`flex w-full rounded items-center justify-between p-2 pl-3 pr-5 bg-teal-100 ring-purple-700 mx-auto
          shadow-teal-100 shadow-sm text-white md:w-2/3 lg:w-1/2 
          ${
            buttonClicked
              ? "fixed bottom-10 left-1/2 transform -translate-x-1/2 w-5/6 "
              : ""
          }`}
        >
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Ask any question about real estate."
            className="text-sm w-4/5 h-10 border-none focus:ring-0 p-auto resize-none overflow-hidden bg-teal-100 md:text-base lg:text-lg"
            onKeyDown={handleKeyDown}
          />
          <button
            className="focus:outline-none"
            disabled={loading || text.trim() === ""}
            onClick={handleClick}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-[#f7b42c] rounded-full mr-1 animate-bounce"></span>
                <span className="w-2 h-2 bg-[#f7b42c] rounded-full mr-1 animate-bounce"></span>
                <span className="w-2 h-2 bg-[#f7b42c] rounded-full animate-bounce"></span>
              </span>
            ) : (
              <BsFillSendFill
                className={`${
                  text.trim() === "" ? "text-gray-500" : "text-[#f7b42c]"
                }`}
              />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
