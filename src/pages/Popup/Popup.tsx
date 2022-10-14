import React, { useCallback, useEffect } from 'react';
import '../../assets/styles/tailwind.css';

// @ts-ignore
import secrets from 'secrets'; // works at runtime, need @ts-ignore as a workaround: https://github.com/lxieyang/chrome-extension-boilerplate-react/issues/67

const Popup = () => {
  useEffect(() => {
    document.onpaste = (evt) => {
      const file = evt.clipboardData?.files[0];
      if (file) {
        console.log(file);
      }
    };
    console.log(secrets);
  }, []);

  // TODO: figure out way to get this to work
  // const clickHandler = useCallback(async () => {
  //   console.log('handling click');
  //   document.body.focus();
  //   document.execCommand('paste');
  //   const data = await navigator.clipboard.read();
  //   console.log(data);
  // }, []);

  return (
    <div className="h-screen w-screen flex gap-2 justify-center items-center flex-col">
      <h2 className="text-center">
        Copy and upload an image from your clipboard
      </h2>
      <span>Hit Ctrl + V to copy an image from your clipboard</span>
      {/* TODO: figure out how to make that work - why is it so difficult loooool */}
      {/* <span>Either hit Ctrl + V or click the button below</span>
      <button
        onClick={clickHandler}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload image from clipboard
      </button> */}
    </div>
  );
};

export default Popup;
