import React, { useState, useEffect } from "react";
import axios from "axios";
import { GLOBALS } from "../GLOBALS";
import { Link } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [group, setGroup] = useState(""); // الحالة لتتبع المجموعة المختارة

  const fetchUsers = async (pageNumber = 1, selectedGroup = "") => {
    try {
      setLoadingMore(true);
      const response = await axios.get(
        `${GLOBALS.SERVER}/api/users/allProjects?page=${pageNumber}&limit=6&group=${selectedGroup}`
      );

      const { users: newUsers, hasMore: moreAvailable } = response.data;
      setUsers((prevUsers) =>
        pageNumber === 1 ? newUsers : [...prevUsers, ...newUsers]
      );
      setHasMore(moreAvailable);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, group); // استدعاء أولي لجلب المستخدمين عند تحميل الصفحة
  }, [group]); // تحديث عند تغيير المجموعة المختارة

  const loadMoreUsers = () => {
    if (hasMore) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchUsers(nextPage, group); // تمرير المجموعة المختارة عند جلب المزيد
        return nextPage;
      });
    }
  };

  return (
    <div className="min-h-[89vh] bg-gray-100">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-sky-800 via-cyan-700 to-teal-700 text-white">
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            TIC • Data Science Project Portal
          </h1>
          <p className="text-white/90 max-w-2xl mt-2">
            Explore student projects aligned with ICT — submit and browse
            PowerPoint and Word documents by group.
          </p>
        </div>
      </div>

      {/* Group Buttons */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-center flex-wrap gap-3">
          {["", "B1", "B2", "B3", "B4"].map((grp) => (
            <button
              key={grp}
              onClick={() => {
                setGroup(grp);
                setPage(1);
                setUsers([]);
              }}
              className={`px-4 py-2 rounded-full border transition shadow-sm ${
                group === grp
                  ? "bg-teal-600 text-white border-teal-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {grp === "" ? "All" : `${grp}`}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white border border-teal-100 shadow-sm rounded-xl p-5 hover:shadow-md transition"
          >
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{user.username}</h3>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <p className="text-teal-700 text-sm font-medium">
                  {user.group || "No Group Assigned"}
                </p>
              </div>
            </div>
            <Link
              to={`/user/${user._id}`}
              className="text-teal-700 font-medium mt-4 inline-block hover:text-teal-800"
            >
              View Submission
            </Link>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            className={`px-6 py-2 rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition ${
              loadingMore ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={loadMoreUsers}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center mt-8">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
