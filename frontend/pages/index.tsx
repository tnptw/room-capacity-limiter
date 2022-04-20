import {
  collection,
  deleteDoc,
  DocumentData,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import firebase from "../lib/firebase";

const Index = () => {
  const classroomCapacity = 50;
  const [students, setStudents] = useState<DocumentData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<DocumentData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setFilteredStudents(
      students.filter((a) =>
        (a.data().first_name + " " + a.data().last_name)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [students, searchQuery]);

  useEffect(() => {
    const db = getFirestore(firebase);
    const studentsRef = collection(db, "students-name");
    const unsubscribe = onSnapshot(studentsRef, (query) => {
      let arr: DocumentData[] = [];
      query.forEach((a) => {
        arr.push(a);
      });
      setStudents(arr);
    });
    return unsubscribe;
  }, []);

  return (
    <div
      className="font-sans flex flex-col justify-center w-full h-screen p-16 space-y-4
          dark:text-[#FAFAFA] dark:bg-stone-900"
    >
      <div className="text-center text-3xl font-bold dark:text-[#f4a7bb]">
        Student Checked in to Classroom #1
      </div>
      <div
        className="flex flex-row border justify-center items-center text-center text-xl mt-5 p-5
      dark:border-none"
      >
        <span className="font-bold">Students in classroom :</span>&nbsp;
        <span>
          {students.length}/{classroomCapacity}
        </span>
      </div>
      <div className="flex justify-center">
        <div className="mb-3"></div>
        <input
          type="search"
          className="form-control block w-fit px-3 py-1.5
                text-base font-normal shadow-lg
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded transition ease-in-out m-0
                dark:bg-black dark:border-none dark:shadow-lg dark:shadow-black/40
                dark:text-white"
                
          id="Search"
          placeholder="Search"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
        ></input>
      </div>
      <div className="flex flex-col justify-center w-full">
        <div
          className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10 justify-center items-center border p-5
        dark:border-none"
        >
          {filteredStudents.map((doc) => {
            return (
              <div
                key={doc.id}
                className="flex flex-col items-center justify-between text-center h-full break-words p-5 hover:bg-gray-100 duration-300 shadow-md rounded-md
                dark:border-t-4 dark:border-rose-500
                dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.6)]
                dark:bg-[#0c0c0c] dark:hover:bg-[#f4a7bb]/80"
              >
                <div className="text-xl font-500">
                  {doc.data().first_name} {doc.data().last_name}
                </div>
                <button
                  className="border mt-2 p-2 hover:bg-red-300 font-bold hover:underline active:bg-red-400 duration-500 
                  dark:bg-[#f4a7bb] dark:border-none rounded-md dark:shadow-lg dark:shadow-[#f4a7bb]/50 dark:hover:bg-[#f8567b]"
                  onClick={async () => {
                    await deleteDoc(doc.ref);
                  }}
                >
                  Check Out
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
