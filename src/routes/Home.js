import { dbService } from "fbase";
import { React, useEffect, useState } from "react";
import Ntweet from "components/Ntweet";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [ntweet, setNtweet] = useState("");
  const [ntweets, setNtweets] = useState([]);
  const [image, setImage] = useState();

  const getNtweets = async () => {
    const dbNtweets = await dbService.collection("ntweets").get();
    dbNtweets.forEach((document) => {
      const ntweetObject = {
        ...document.data(),
        id: document.id,
      };
      setNtweets((prev) => [ntweetObject, ...prev]);
    });
  };

  useEffect(() => {
    dbService.collection("ntweets").onSnapshot((snapshot) => {
      const ntweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNtweets(ntweetArray);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const imgRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
    const response = await imgRef.putString(image, "data_url");

    // await dbService.collection("ntweets").add({
    //   text: ntweet,
    //   createdAt: Date.now(),
    //   creatorId: userObj.uid,
    // });
    // setNtweet("");
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
    <div>
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
      <div>
        {ntweets.map((ntweet) => (
          <Ntweet
            key={ntweet.id}
            ntweetObj={ntweet}
            isOwner={ntweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
