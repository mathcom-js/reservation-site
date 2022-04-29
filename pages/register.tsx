import { useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import { FileInput, Input, TimeInput } from "../components/Input";

export default function Register() {
  return (
    <>
      <Header />
      <form>
        <div className="max-w-xl w-full flex flex-col mx-auto mt-20 space-y-8">
          <h1 className="text-center text-lg text-violet-400">
            Register Your Shop
          </h1>

          <Input name="Your Shop Name" />
          <TimeInput name="Your Time" />
          <Input name="Your Description" />
          <Input name="Your Location" />
          <FileInput name="Your Shop Image" />

          <Button text="Register" />
        </div>
      </form>
    </>
  );
}
