import { useState, useEffect } from "react";
import {commonFormatddMMYYYYHHmm} from '../helper/common'
import {
  fetchData,
  showToastMessage,
  showToastError,
  baseUrl,
} from "../global";
import { ToastContainer } from "react-toastify";
import { useParams, useLocation } from "react-router-dom";

export default function DetailAssignment() {
  const params = useParams();
  const location = useLocation();
  const [assignment, setAssignment] = useState();

  async function getTeacherDetailAssignment() {
    const subUrl = `/student/assignments/${params.idAssignment}`;

    try {
      const response = await fetchData(subUrl, "GET");
      setAssignment(response.data);
    } catch (error) {
      showToastMessage(error.message);
    }
  }

  async function handleSubmit() {
    const url = `${baseUrl}/student/submits`;
    const formData = new FormData();

    const accessToken = localStorage.getItem("accessToken");

    try {
      const elFiles = document.getElementById("file");
      const file = elFiles.files[0];
      formData.append("idGroup", params.idClass);
      formData.append("idAssignment", params.idAssignment);
      formData.append("file", file);
      const jsonRp = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const response = await jsonRp.json();

      if (!jsonRp.ok) {
        throw new Error(response.message);
      }

      showToastMessage("Submitted successfully");
    } catch (error) {
      showToastError(error.message)
    }
  }

  useEffect(() => {
    getTeacherDetailAssignment();
  }, []);

  return (
    assignment && (
      <div>

  
      <div className="flex flex-col gap-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg text-gray-700 font-bold uppercase">
              {assignment.name}
            </h3>
            {location.pathname.includes("student") && (
              <div className="mt-4">
                <button
                  className="bg-blue-500 text-white font-bold px-4 rounded-sm py-1"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <input
                  className="ml-6"
                  type="file"
                  accept=".pdf"
                  name=""
                  id="file"
                />
              </div>
            )}
          </div>
          <p className="text-sm">{commonFormatddMMYYYYHHmm(assignment.deadline)} (deadline)</p>
        </div>
        <p className="text-gray-600 text-sm">{assignment.description}</p>
        {/* cho người dùng nộp bài. */}
        <ToastContainer />
      </div>

      <div className="flex justify-center mt-7">
          <iframe
            className="w-[900px] h-screen"
            src={assignment.url}
            loading="lazy"
            title="Iframe Example"
          ></iframe>
        </div>
      </div>
    )
  );
}
