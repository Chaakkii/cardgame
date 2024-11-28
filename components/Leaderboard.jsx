import { useState, useEffect } from 'react';

function TopList() {
  const [topList, setTopList] = useState([]);

  useEffect(() => {
    const fetchTopList = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/toplist');
        const data = await response.json();
        setTopList(data); 
      } catch (error) {
        console.error('Virhe toplistan hakemisessa:', error);
      }
    };

    fetchTopList();
  }, []);

  return (
    <div>
      <h2>Top 5 Pelaajat</h2>
      <ul>
        {topList.map((user, index) => (
          <li key={index}>{user.userName}: {user.score} pistettä</li>
        ))}
      </ul>
    </div>
  );
}

export default TopList;
