import DeleteAccount from "components/pages/account/DeleteAccount";
import UpdateEmail from "components/pages/account/UpdateEmail";
import UpdatePassword from "components/pages/account/UpdatePassword";

const Account = () => {
  return (
    <main className="account">
      <div className="container">
        <UpdateEmail />
        <UpdatePassword />
        <DeleteAccount />
      </div>
    </main>
  );
};

export default Account;
