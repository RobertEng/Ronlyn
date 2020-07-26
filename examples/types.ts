interface JournalEntry {
  picUrl: string;
  captions: string[];
}

interface Journal {
  title: string;
  entries: JournalEntry[];
}

interface StrategyEntry {
  picUrl: string;
}

interface FillInExercise {
  title: string;
  entries: FillInEntry[];
}

// Option 1
interface FillInEntry {
  sentence: string; // I pour a cup of hot %
  answers: string[];
}

const fillin: FillInEntry = {
  sentence: "I also eat oatmeal with berries like % and %.",
  answers: ["blueberries", "strawberries"],
};

const fillin = {
  sentence: "I also eat oatmeal with berries like % and %.",
  answers: ["blueberries", "strawberries"],
};

// Option 2
type FragmentType = "fill-in" | "hardcoded";

interface Clause {
  fragment: string;
  fragmentType: FragmentType;
}

const section1 = { fragment: "I pour a cup of hot", fragmentType: "hardcoded" };
const section2 = { fragment: "coffee", fragmentType: "fill-in" };
const fillIn: Clause[] = [section1, section2];

const section1 = {
  fragment: "I also eat <span className='red'>oatmeal<span> with berries like",
  fragmentType: "hardcoded",
};
const section2 = { fragment: "blueberries", fragmentType: "fill-in" };
const section3 = { fragment: "and", fragmentType: "hardcoded" };
const section2 = { fragment: "strawberries", fragmentType: "fill-in" };
const fillIn: Clause[] = [section1, section2, section3, section4];

const answers: string[] = ["kitchen"];
