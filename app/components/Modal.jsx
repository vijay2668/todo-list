"use client";
import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const Modal = ({ setOpenModal, updateModal, Lists }) => {
  updateModal = { ...updateModal };
  // console.log(updateModal);
  const [inputValue, setinputValue] = useState({
    category: updateModal?.category || "",
    task_title: updateModal?.task_title || "",
    date_time: updateModal?.date_time || ""
  });

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setinputValue((prevUser) => ({ ...prevUser, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent the default form submission behavior

    // check if the updateModal object exists and is truthy
    if (updateModal?.update) {
      let updatedLists = [...Lists]; // create a copy of the original array

      // get the sub-array to update from the copy of the original array
      const listToUpdate = updatedLists[updateModal?.index]?.filter(
        (list) => list.task_title === updateModal?.task_title
      );

      // check if the list to update exists and is truthy
      if (listToUpdate) {
        // check if the category of the list to update matches the input category
        if (updateModal?.category === inputValue.category) {
          // update the properties of the list object
          listToUpdate[0].task_title = inputValue.task_title;
          listToUpdate[0].date_time = inputValue.date_time;

          // store the modified sub-array in localStorage
          localStorage.setItem(
            updateModal?.category,
            JSON.stringify(updatedLists[updateModal?.index])
          );
        } else {
          // remove the updated item from the original array
          let items = Lists[updateModal?.index]?.filter(
            (i) => i?.task_title !== updateModal?.task_title
          );

          // store the modified sub-array in localStorage
          localStorage.setItem(updateModal?.category, JSON.stringify(items));

          // add the updated item to the new category in localStorage
          let isCategoryexist = JSON.parse(
            localStorage.getItem(inputValue.category)
          );
          if (isCategoryexist) {
            isCategoryexist.push(inputValue);
            localStorage.setItem(
              inputValue.category,
              JSON.stringify(isCategoryexist)
            );
          } else {
            localStorage.setItem(
              inputValue.category,
              JSON.stringify([inputValue])
            );
          }
        }
      }
    } else {
      // add the input value to localStorage
      let isCategoryexist = JSON.parse(
        localStorage.getItem(inputValue.category)
      );
      if (isCategoryexist) {
        isCategoryexist.push(inputValue);
        localStorage.setItem(
          inputValue.category,
          JSON.stringify(isCategoryexist)
        );
      } else {
        if(inputValue.category!=="", inputValue.task_title!=="", inputValue.date_time!==""){
          localStorage.setItem(inputValue.category, JSON.stringify([inputValue]));
        }
      }
    }
    window.location.reload(); // reload the page
  };

  // console.log(inputValue);

  return (
    <div className="z-10 w-screen h-screen absolute top-0 left-0 flex items-center justify-center bg-black/70">
      <form onSubmit={handleSubmit} className="relative form bg-neutral">
        <button
          onClick={() => {
            Object.keys(updateModal).length !== 0 && window.location.reload();
            setOpenModal(false);
          }}
          className="text-error absolute top-2 right-2 p-2"
        >
          <IoCloseSharp fontSize={25} />
        </button>
          <label>
            <input
              required=""
              name="task_title"
              placeholder="Enter Task"
              type="text"
              value={inputValue.task_title}
              className="input input-bordered input-primary w-full max-w-xs"
              onChange={handleChange}
            />
          </label>

          <label>
            <select
              name="category"
              required=""
              className="select select-primary w-full max-w-xs"
              value={inputValue.category}
              onChange={handleChange}
            >
              <option value="">Pick one</option>
              <option value="urgent-important">Urgent &amp; Important</option>
              <option value="not-urgent-important">
                Not Urgent &amp; Important
              </option>
              <option value="urgent-not-important">
                Urgent &amp; Not Important
              </option>
              <option value="not-urgent-not-important">
                Not Urgent &amp; Not Important
              </option>
            </select>
          </label>
        <label>
          <input
            required=""
            name="date_time"
            type="datetime-local"
            value={inputValue.date_time}
            className="input input-bordered input-primary w-full max-w-xs"
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="btn btn-primary">
          {updateModal?.update ? "update" : "submit"}
        </button>
      </form>
    </div>
  );
};

export default Modal;
