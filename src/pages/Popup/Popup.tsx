import React, { useEffect, useState } from 'react';
import '../../assets/styles/tailwind.css';
// @ts-ignore
import secrets from 'secrets'; // works at runtime, need @ts-ignore as a workaround: https://github.com/lxieyang/chrome-extension-boilerplate-react/issues/67

import Input from './Input';

const Popup = () => {
  const [authData, setAuthData] = useState<{ [key: string]: any }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
          const headers = new Headers();
          // for anonymous uploads, we could just use this...
          // headers.append('Authorization', `Client-ID ${secrets.CLIENT_ID}`);
          //... this is how we do a upload in the name of the currently logged in user
          headers.append('Authorization', `Bearer ${authData.access_token}`);

          const formdata = new FormData();
          formdata.append('image', new Blob([await file.arrayBuffer()]));
          console.log({ title, description });
          if (title) formdata.append('title', title);
          if (description) formdata.append('description', description);

          fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: headers,
            body: formdata,
            redirect: 'follow',
          })
            .then((response) => response.json())
            .then((result) => console.log(result))
            .catch((error) => console.log('error', error));
        }
      };
    }
  }, [authData, title, description]);

  return (
    <div className="h-screen w-screen flex gap-2 justify-center items-center flex-col">
      <h2 className="text-center">
        Copy and upload an image from your clipboard
      </h2>
      {authData?.access_token ? (
        <>
          <span>Hit Ctrl + V to copy an image from your clipboard</span>
          <Input
            onChange={(evt) => {
              setTitle(evt.target.value);
            }}
            id="title"
            type="text"
            label="Title"
            placeholder="(Optional) title..."
          />
          <Input
            onChange={(evt) => {
              setDescription(evt.target.value);
            }}
            id="description"
            type="text"
            label="Description"
            placeholder="(Optional) description..."
          />
        </>
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
