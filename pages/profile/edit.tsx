import Header from "../../components/Header";

const FAKE_DATA = {
  id: 1,
  username: "Sinclairr",
  shops: [{ id: 1, name: "Test1" }],
  reviews: [{ id: 1, review: "This Was good" }],
};

export default function EditProfile() {
  return (
    <>
      <Header />
      <div className="mt-20">{FAKE_DATA.username}</div>

      <div></div>
    </>
  );
}
