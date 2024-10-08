import { useEffect, useState } from "react";
import { baseUrl, fetchData, showToastError, showToastMessage } from "../global";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify"
import Empty from "./Empty";
import {commonFormatddMMYYYYHHmm} from '../helper/common'

export default function Assignments() {
  const params = useParams();
  const navigate = useNavigate()
  const [name, setName] = useState();
  const [desc, setDesc] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState();

  const location = useLocation();

  const [isOpenCreateAsm, setIsOpenCreateAsm] = useState();

  const [assignments, setAssignments] = useState();

  const accessToken = localStorage.getItem("accessToken");

  async function getAssignments() {
    const subUrl = `/student/assignments?id-group=${params.id}`;
    const responsse = await fetchData(subUrl, "GET");
    setAssignments(responsse.data);
  }
  async function handleCreateAsm(e) {
    e.preventDefault();

    const url = `${baseUrl}/teacher/assignments`;

    const elFiles = document.getElementById("file");
    const file = elFiles.files[0];
    const deadline = date + " " + time;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", desc);
    formData.append("idGroup", params.id);
    formData.append("deadline", deadline);
    formData.append("file", file);

    try {
      const jsonRp = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const response = await jsonRp.json();
      await getAssignments();

      if (!jsonRp.ok) {
        throw new Error(response.message);
      }
      setIsOpenCreateAsm(false);
      showToastMessage("Create successful assignments");
    } catch (error) {
      showToastError(error.message)
    }
  }

  function getDetailAsm(id) {
    // chuyển hướng tới .
    if (location.pathname.includes('owner')) {
      navigate(`/teacher/groups/${params.id}/assignments/${id}`)
    }
    else {
      navigate(`/student/groups/${params.id}/assignments/${id}`)
    }
  }



  useEffect(() => {
    getAssignments();
  }, []);

  const customStyles = {
    content: {
      width: "600px",
      height: "350px",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "42px 42px",
      borderRadius: "8px",
      backgroundColor: "white",
      outline: "none",
      overflow: "auto",
    },
  };

  return (
    assignments && (
      <div>
        <div className="flex justify-end">
          {location.pathname.includes("owner") && (
            <button className="mb-4">
              <img
                onClick={() => setIsOpenCreateAsm(true)}
                src='/plus.png'
                className='w-9'
                alt=''
              />
            </button>

          )}
        </div>

        {/* kiểm tra độ dài của assignments */}

        {
          assignments.length != 0 ? (assignments.map((assignment, index) => {
            return (
              <div
                key={index}
                onClick={() => getDetailAsm(assignment.id)}
                className="cursor-pointer mb-8 shadow-md px-8 py-5 bg-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-x-3">
                  <i className="fa-solid fa-file text-xl font-light"></i>
                  <span className="opacity-90">{assignment.name}</span>
                  <span>({assignment.quantitySubmit} submit)</span>
                </div>

                <span className="text-xs text-[#6D6E6E]">
                  {commonFormatddMMYYYYHHmm(assignment.deadline)} (deadline)
                </span>
              </div>
            );
          })) : (<Empty />)
        }


        <Modal
          isOpen={isOpenCreateAsm}
          onRequestClose={() => setIsOpenCreateAsm(false)}
          contentLabel="Custom Modal"
          style={customStyles}
        >
          <form onSubmit={handleCreateAsm} className="">
            <div className="flex justify-between">
            <h3 className="text-xl text-gray-800 font-bold">Create assignment</h3>
              <button onClick={() => setIsOpenCreateAsm(false)} type="button">
                <img src="/close.png" className="w-5 h-5" alt="" />
              </button>
            </div>
           

            <div className="mt-6 flex gap-x-6 justify-between">
              <div className="flex flex-col gap-y-2 w-full">
                <label className="text-sm text-gray-600" htmlFor="">
                  Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="h-9 px-4"
                  required
                />
              </div>

              <div className="flex flex-col gap-y-2 w-full">
                <label className="text-sm text-gray-600" htmlFor="">
                description
                </label>
                <input
                  onChange={(e) => setDesc(e.target.value)}
                  type="text"
                  className="h-9 px-4"
                  required
                />
              </div>
            </div>

            <div className="mt-5 flex gap-x-6 justify-between">
              <div className="flex flex-col gap-y-2 w-full">
                <label className="text-sm text-gray-600" htmlFor="">
                  Date
                </label>
                <input
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  className="h-9 px-4"
                  required
                />
              </div>

              <div className="flex flex-col gap-y-2 w-full">
                <label className="text-sm text-gray-600" htmlFor="">
                  Hour
                </label>
                <input
                  onChange={(e) => setTime(e.target.value)}
                  type="time"
                  className="h-9 px-4"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex gap-x-3 justify-between items-center">
              <div className="w-full">
                {/* ẩn đi với role student */}
                <button
                  type="submit"
                  className="h-10 flex items-center gap-x-2 px-8 text-sm text-center text-white font-bold rounded-md bg-primary sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300"
                >
                  Submit
                </button>
              </div>

              <input type="file" name="file" id="file" accept=".pdf" required />
            </div>
          </form>
        </Modal>
        <ToastContainer />
      </div>
    )
  );
}
