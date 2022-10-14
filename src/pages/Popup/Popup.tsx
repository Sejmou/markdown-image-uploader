import React, { useEffect, useState } from 'react';
import '../../assets/styles/tailwind.css';
// @ts-ignore
import secrets from 'secrets'; // works at runtime, need @ts-ignore as a workaround: https://github.com/lxieyang/chrome-extension-boilerplate-react/issues/67

const Popup = () => {
  const [authData, setAuthData] = useState<{ [key: string]: any }>();

  useEffect(() => {
    const getAuthData = async () => {
      const authData = (await chrome.storage.local.get(['authData'])).authData;
      setAuthData(authData);
    };
    getAuthData();
  }, []);

  useEffect(() => {
    if (authData) {
      console.log('auth data', authData);
      document.onpaste = async (evt) => {
        const file = evt.clipboardData?.files[0];
        if (file) {
          console.log(file);

          const body = new FormData();
          body.append('file', new Blob([await file.arrayBuffer()]));
          body.append('fileName', file.name);
          body.append('publicKey', secrets.PUBLIC_KEY);
          body.append(
            'expire',
            (Math.floor(Date.now() / 1000) + 60 * 59).toString()
          );

          fetch('https://upload.imagekit.io/api/v1/files/upload', {
            body,
            headers: {
              Authorization: 'Basic eW91cl9wcml2YXRlX2FwaV9rZXk6',
              'Content-Type': 'multipart/form-data',
            },
            method: 'POST',
          });
        }
      };
    }
  }, [authData]);

  return (
    <div className="h-screen w-screen flex gap-2 justify-center items-center flex-col">
      <h2 className="text-center">
        Copy and upload an image from your clipboard
      </h2>
      {authData?.access_token ? (
        <span>Hit Ctrl + V to copy an image from your clipboard</span>
      ) : (
        <span>
          Please{' '}
          <a
            href={`https://api.imgur.com/oauth2/authorize?client_id=${secrets.CLIENT_ID}&response_type=token`}
            target="_blank"
            rel="noreferrer"
          >
            authenticate
          </a>{' '}
          first.
        </span>
      )}
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
