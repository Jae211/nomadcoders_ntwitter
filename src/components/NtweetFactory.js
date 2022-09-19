import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageService, dbService } from "fbase";

const NtweetFactory = ({ userObj }) => {
  const [ntweet, setNtweet] = useState("");
  const [image, setImage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    let imgUrl = "";
    if (image !== "") {
      const imgRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await imgRef.putString(image, "data_url");
      imgUrl = await response.ref.getDownloadURL();
    }

    const newNtweet = {
      text: ntweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      imgUrl,
    };
    await dbService.collection("ntweets").add(newNtweet);
    setNtweet("");
    setImage("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNtweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      setImage(finishedEvent.currentTarget.result);
    }; //read가 끝나면 수행됨
    reader.readAsDataURL(theFile);
  };

  const onClearImg = () => setImage(null);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          value={ntweet}
          onChange={onChange}
          type="text"
          placeholder="무슨일이 일어나고 있나요?"
          maxLength={200}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Ntweet" />
        {image && <img src={image} width="50px" height="50px" />}
        <button onClick={onClearImg}>Clear</button>
      </form>
    </>
  );
};

export default NtweetFactory;
