import type { NextPage } from "next";
import Todo from "components/Todo";

const Home: NextPage = () => {
  return (
    <div className="todo">
      <Todo />
    </div>
  );
};

export default Home;
