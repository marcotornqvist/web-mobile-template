import type { NextPage } from "next";
import Form from "components/todo/Form";
import Todos from "components/todo/Todos";
import TodoProvider from "context/todoContext";

const Home: NextPage = () => {
  return (
    <TodoProvider>
      <main className="landing">
        <div className="container">
          <Form />
          <Todos />
        </div>
      </main>
    </TodoProvider>
  );
};

export default Home;
