import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GLOBALS } from "../GLOBALS";
import { FaRegFilePowerpoint } from "react-icons/fa6";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";

const UserFilesPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const response = await axios.get(`${GLOBALS.SERVER}/api/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user files:", error);
      }
    };
    fetchUserFiles();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        {user?.username || "User Files"}
      </h2>

      <ul className="space-y-4">
        <li className="flex flex-col bg-white justify-center items-center shadow-md p-4 rounded-lg">
          {/* PowerPoint and Word document links */}
          <div className="flex justify-center p-8 space-x-8">
            {user?.powerPointUrl ? (
              <a
                href={user.powerPointUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center space-y-2 hover:opacity-75 transition bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md"
              >
                <FaRegFilePowerpoint className="text-red-500" size={48} />
                <span className="text-base text-gray-700 font-medium">PowerPoint File</span>
              </a>
            ) : (
              <div className="flex flex-col items-center space-y-2 bg-gray-50 p-6 rounded-lg">
                <FaRegFilePowerpoint className="text-gray-400" size={48} />
                <span className="text-sm text-red-500">No PowerPoint file</span>
              </div>
            )}
            {user?.wordDocumentUrl ? (
              <a
                href={user.wordDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center space-y-2 hover:opacity-75 transition bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md"
              >
                <PiMicrosoftWordLogoFill className="text-blue-500" size={48} />
                <span className="text-base text-gray-700 font-medium">Word Document</span>
              </a>
            ) : (
              <div className="flex flex-col items-center space-y-2 bg-gray-50 p-6 rounded-lg">
                <PiMicrosoftWordLogoFill className="text-gray-400" size={48} />
                <span className="text-sm text-red-500">No Word file</span>
              </div>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default UserFilesPage;
