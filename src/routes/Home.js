import { dbService } from "fbase";
import { React, useEffect, useState } from "react";
import Ntweet from "components/Ntweet";

const Home = ({ userObj }) => {
  const [ntweet, setNtweet] = useState("");
  const [ntweets, setNtweets] = useState([]);

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
    dbService.collection("ntweets").add({
      text: ntweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNtweet("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNtweet(value);
  };

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
        <input type="submit" value="Ntweet" />
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
