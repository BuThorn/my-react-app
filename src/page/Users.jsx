import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, UserCheck, UserX } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/team';

export default function Users() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // State សម្រាប់ Form (ថែម ឬ កែ)
  const [formData, setFormData] = useState({ id: null, name: '', email: '', role: 'Member', status: 'Active' });

  // ១. ទាញយកទិន្នន័យសមាជិកពី MySQL ពេលបើកទំព័រ
  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  // ២. មុខងាររក្សាទុកទិន្នន័យ (បានទាំង បន្ថែមថ្មី និង កែប្រែចាស់)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (formData.id) {
        // បើមាន ID មានន័យថាជាការកែប្រែ (Update)
        await axios.put(`${API_URL}/${formData.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        // បើគ្មាន ID មានន័យថាជាការបន្ថែមថ្មី (Create)
        await axios.post(API_URL, formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchMembers(); // រំលឹកទាញទិន្នន័យថ្មី
      setShowModal(false);
      setFormData({ id: null, name: '', email: '', role: 'Member', status: 'Active' });
    } catch (error) {
      alert(error.response?.data?.message || "មានបញ្ហាពេលរក្សាទុក");
    }
  };

  // ៣. មុខងារលុបសមាជិក (Delete)
  const handleDelete = async (id) => {
    if (!window.confirm("តើអ្នកប្រាកដជាចង់លុបសមាជិកនេះមែនទេ?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error("លុបមិនបានជោគជ័យ:", error);
    }
  };

  // បើក Form កែប្រែ
  const handleEditClick = (member) => {
    setFormData(member);
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Members</h1>
          <p className="text-sm text-slate-500">គ្រប់គ្រងគណនីបុគ្គលិក និងសិទ្ធិប្រើប្រាស់ប្រព័ន្ធ</p>
        </div>
        <button 
          onClick={() => { setFormData({ id: null, name: '', email: '', role: 'Member', status: 'Active' }); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-5 h-5" /> បន្ថែមសមាជិក
        </button>
      </div>

      {/* តារាងបង្ហាញបញ្ជីឈ្មោះ */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 border-b border-slate-200 dark:border-slate-700 text-sm">
              <th className="p-4">ឈ្មោះ / អ៊ីមែល</th>
              <th className="p-4">តួនាទី</th>
              <th className="p-4">ស្ថានភាព</th>
              <th className="p-4 text-right">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
            {loading ? (
              <tr><td colSpan="4" className="p-8 text-center text-slate-400">កំពុងផ្ទុកទិន្នន័យ...</td></tr>
            ) : members.map((member) => (
              <tr key={member.id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                <td className="p-4">
                  <div className="font-semibold text-slate-900 dark:text-white">{member.name}</div>
                  <div className="text-xs text-slate-400">{member.email}</div>
                </td>
                <td className="p-4">{member.role}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400'
                  }`}>
                    {member.status === 'Active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                    {member.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEditClick(member)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700" title="កែប្រែ"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(member.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700" title="លុប"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 팝업 Popup Modal សម្រាប់ បន្ថែម ឬ កែប្រែ */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{formData.id ? 'កែប្រែព័ត៌មានសមាជិក' : 'បន្ថែមសមាជិកថ្មី'}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">ឈ្មោះ</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">អ៊ីមែល</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">តួនាទី</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2.5 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                    <option value="Manager">Manager</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">ស្ថានភាព</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2.5 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">បោះបង់</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">រក្សាទុក</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
