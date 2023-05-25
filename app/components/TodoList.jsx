"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { MdOutlineDeleteOutline, MdOutlineMic } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { BiEdit } from "react-icons/bi";

const TodoList = () => {
 
  const [OpenModal, setOpenModal] = useState(false);
  const [Lists, setLists] = useState();
  let categoryArray = [
    "Urgent & Important",
    "Not Urgent & Important",
    "Urgent & Not Important",
    "Not Urgent & Not Important"
  ];
  
  useEffect(() => {
  let StoredList;
  try {
    StoredList = [
      JSON.parse(localStorage.getItem("urgent-important")),
      JSON.parse(localStorage.getItem("not-urgent-important")),
      JSON.parse(localStorage.getItem("urgent-not-important")),
      JSON.parse(localStorage.getItem("not-urgent-not-important"))
    ];
  } catch (error) {
    console.log(error);
  }
  setLists(StoredList);
}, []);

  if (Lists?.length > 0) {
    const now = new Date().toISOString().slice(0, 16);
    let filterByDateDelete = Lists[1]?.filter((obj) => obj.date_time > now);
    let filterByDateMove = Lists[1]?.filter((obj) => obj.date_time < now);

    if (filterByDateDelete) {
      localStorage.setItem(
        "not-urgent-important",
        JSON.stringify(filterByDateDelete)
      );
    }
    let isCategoryexist = JSON.parse(localStorage.getItem("urgent-important"));
    if (isCategoryexist) {
      filterByDateMove?.forEach((element) => {
        element.category = "urgent-important";
        isCategoryexist.push(element);
        localStorage.setItem(
          "urgent-important",
          JSON.stringify(isCategoryexist)
        );
      });
    } else {
      let newArray = [];
      filterByDateMove?.forEach((element) => {
        element.category = "urgent-important";
        newArray.push(element); // add object to array
      });
      if (newArray.length > 0) {
        localStorage.setItem("urgent-important", JSON.stringify(newArray)); // store updated array in localStorage
      }
    }
    // console.log(filterByDateMove)
  }
  
  const handleInputChange = (e, index, item) => {
    const { checked } = e.target;
    if (checked) {
      let updatedLists = [...Lists]; // create a copy of the original array
      const listToUpdate = updatedLists[index]?.filter(
        // console.log(listToUpdate);
        (list) => list.task_title === item.task_title
        );
        if (listToUpdate) {
          listToUpdate[0].completed = true; // update the object's "completed" property
          localStorage.setItem(
            item.category,
            JSON.stringify(updatedLists[index])
            ); // store the modified sub-array in localStorage
          }
        }
  };
  
  const [updateModal, setupdateModal] = useState();
  
  const handleEdit = (index, item) => {
    setOpenModal(true);
    item.update = true;
    item.index = index;
    // console.log(item);
    setupdateModal(item);
  };
  
  if (Lists) {
    return (
      <div className="w-screen bg-base-100 relative h-full md:h-screen z-0 flex flex-col items-center justify-center p-2">
          <button
            className="btn btn-primary mb-2"
            onClick={() => setOpenModal(true)}
            >
            <IoMdAdd className="mr-2" fontSize={18} />
            Add
          </button>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 w-[90%] h-[90%]">
          {categoryArray.map((gridCategory, gridIndex) => (
            <div key={gridIndex} className="collapse md:collapse-open border-2 rounded-lg text-center">
              <input className="block md:hidden" type="checkbox" />
              <h2 className="collapse-title text-xl shadow-sm shadow-white p-1">
                {gridCategory}
              </h2>
              <ul className="collapse-content p-2">
                {Lists[gridIndex]?.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center w-full border-b-2 border-primary p-2"
                  >
                    <div className="flex items-center">
                      <input
                        className="checkbox checkbox-primary"
                        type="checkbox"
                        checked={item?.completed}
                        onChange={(e) => handleInputChange(e, gridIndex, item)}
                      />
                      <p className="text-lg font-light">{item?.task_title}</p>
                      <p className="text-sm">{item?.date_time}</p>
                    </div>
                    <button
                      className="p-1"
                      onClick={() => {
                        let items = Lists[gridIndex]?.filter(
                          (i) => i?.task_title !== item?.task_title
                        );
                        localStorage.setItem(
                          item?.category,
                          JSON.stringify(items)
                        );
                        window.location.reload();
                      }}
                    >
                      <MdOutlineDeleteOutline
                        className="text-error"
                        fontSize={25}
                      />
                    </button>
                    <button
                      className="p-1"
                      onClick={() => handleEdit(gridIndex, item)}
                    >
                      <BiEdit className="text-secondary" fontSize={25} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {OpenModal && (
          <Modal
            setOpenModal={setOpenModal}
            updateModal={updateModal}
            Lists={Lists}
          />
        )}
      </div>
    );
  }
};

export default TodoList;
