// 'use client';
// import {useState} from "react";
//
// export default function SearchBarPage({onSearch}) {
//     const [query, setQuery] = useState("");
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSearch(query);
//     };
//
//     return (
//         <form onSubmit={handleSubmit}>
//             <input
//                 type="text"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="type and enter plz"
//             />
//         </form>
//     );
// }