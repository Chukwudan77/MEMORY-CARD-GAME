import { useEffect, useState } from "react";
import { Card } from "./components/Card";
import { GameHeader } from "./components/GameHeader"

const cardValues=[
  "🐟",
  "🐙",
  "🦑",
  "🦐",
  "🐬",
  "🐳",
  "🦈",
  "🐢",
  "🐟",
  "🐙",
  "🦑",
  "🦐",
  "🐬",
  "🐳",
  "🦈",
  "🐢",
];


function App() {
  const [cards, setCards]=useState([])
  const [flippedCard, setFlippedCard]=useState([]);
  const [matchedCard, setMatchedCard]=useState([]);
  const [score, setScore]=useState(0)
  const [moves, setMoves]=useState(0)
  const [isLocked, setIsLocked]=useState(false)

  const shuffleArray = (array) => {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));   // FIX: added semicolon
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }                                                  // FIX: closed the for loop

    return shuffled;
  };

  const intializeGame=()=>{
    const shuffled=shuffleArray(cardValues)
    // Shuffle card


    const finalCards=shuffled.map((value, index)=>({
      id:index,
      value,
      isFlipped:false,
      isMatched:false
    }));
    setCards(finalCards);

    setMoves(0);
    setScore(0);
    setMatchedCard([]);
    setFlippedCard([]);
    setIsLocked(false)
  };

  useEffect(() => {
    intializeGame();
  }, []);

  const handleCardClick=(card)=>{
    if(card.isFlipped || card.isMatched || isLocked || flippedCard.length==2){
      return;
    }

    // Update card flipped state
    const newCards=cards.map((c)=>{
      if(c.id=== card.id){
        return{...c, isFlipped:true}
      }else{
        return c;
      }
    })
    setCards(newCards)

    const newFlippedCard=[...flippedCard, card.id];
    setFlippedCard(newFlippedCard)

    // Check for match if two cards are flipped

    if (flippedCard.length===1){
      setIsLocked(true);
      const firstCard=cards[flippedCard[0]];

      if(firstCard.value===card.value){
        setTimeout(()=>{
          setMatchedCard((prev)=>{
            return [...prev, firstCard.id, card.id]});   // FIX: added return


          setCards((prev)=>
            prev.map((c)=>{
              if(c.id=== card.id || c.id===firstCard.id){
                return{...c, isMatched:true}
              }else{
                return c;
              }
            })
          );
          setScore((prev)=>prev + 1)
          setFlippedCard([]);
          setIsLocked(false)
        }, 500)

      }else{
        setTimeout(()=>{
          const flippedBackCard=newCards.map((c)=>{
            if (newFlippedCard.includes(c.id)|| c.id===card.id){
              return {...c, isFlipped:false};
            }else{
              return c;
            }
          })
          setCards(flippedBackCard)
          setFlippedCard([]);
          setIsLocked(false)                             // FIX: unlock here, after the flip-back
        },1000)
      }

      setMoves((prev)=> prev + 1)
                                                         
    }

  }

  return (
    <div className="app">
      <GameHeader score={score} move={moves} onReset={intializeGame}/>

      <div className="cards-grid">
        {cards.map((card)=>(
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}/>
        ))}
      </div>

    </div>

  );
}

export default App