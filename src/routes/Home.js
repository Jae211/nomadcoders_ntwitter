import { dbService } from "fbase";
import { React, useEffect, useState } from "react";
import Ntweet from "components/Ntweet";
import NtweetFactory from "components/NtweetFactory";

const Home = ({ userObj }) => {
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

  return (
    <div>
      <NtweetFactory userObj={userObj} />
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
