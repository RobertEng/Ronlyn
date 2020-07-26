// fill-in-component.tsx

import React, { useState } from "react";

// imported from somewhere else like a backend or like a json file or something
const section1 = { fragment: "I pour a cup of hot", fragmentType: "hardcoded" };
const section2 = { fragment: "coffee", fragmentType: "fill-in" };
const fillIn1: Clause[] = [section1, section2];

const s1 = {
  fragment: "I also eat <span className='red'>oatmeal<span> with berries like",
  fragmentType: "hardcoded",
};
const s2 = { fragment: "blueberries", fragmentType: "fill-in" };
const s3 = { fragment: "and", fragmentType: "hardcoded" };
const s2 = { fragment: "strawberries", fragmentType: "fill-in" };
const fillIn2: Clause[] = [s1, s2, s3, s4];

const fillIns = [fillIn1, fillIn2];

const FillInComponent: React.FC<{}> = () => {
  function formatFillIn(fillIn: Clause[]) {
    // map is an iterator. It's like forEach but returns an array
    return (
      <li>
        {fillIn.map((clause: Clause) => (
          <ul>{clause.fragment}</ul>
        ))}
      </li>
    );
  }

  return (
    <div>{data.fillIns.map((fillIn: Clause[]) => formatFillIn(fillIn))}</div>
  );
};

export default FillInComponent;

type FragmentType = "fill-in" | "hardcoded";
interface Clause {
  fragment: string;
  fragmentType: FragmentType;
}

const ClauseComponent: React.FC<{ clause: Clause }> = (props) => {
  const { clause } = props;

  const [cursorIndex, setCursorIndex] = useState<number>(undefined);
  const [isRevealed, setIsRevealed] = useState(false);

  const formatWord = (word: string, wordIndex: number) => {
    let formattedWord = word;
    if (cursorIndex === wordIndex) {
      formattedWord = <span className="underlined">{word}</span>; // TODO: Underline it
    }
    return <div onClick={() => setCursorIndex(wordIndex)}>{formattedWord}</div>;
  };

  if (fragmentType === "hardcoded") {
    return (words = clause.fragment
      .split(" ")
      .map((word, index) => formatWord(word, index)));
  } else {
    return isRevealed
      ? clause.fragment
      : "_".repeat(clause.fragment.length + 2);
  }
};
