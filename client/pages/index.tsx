import type { NextPage } from "next";
import Form from "components/todo/Form";
import Todos from "components/todo/Todos";

const Home: NextPage = () => {
  return (
    <main className="landing">
      <div className="container">
        <Form />
        <Todos />
      </div>
    </main>
  );
};

export default Home;
