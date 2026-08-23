import { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, User, FileText, Wrench, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ProfileSettings() {
    const [formData, setFormData] = useState({
        username: '',
        cover_image: '',
        description: '',
        skills: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    // ១. ទាញយកព័ត៌មាន Profile ពី Backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/api/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setFormData({
                    username: response.data.username || '',
                    cover_image: response.data.cover_image || '',
                    description: response.data.description || '',
                    skills: response.data.skills || ''
                });
            } catch (error) {
                console.error("Fetch profile error:", error);
                setStatusMessage({ type: 'error', text: 'មិនអាចទាញយកទិន្នន័យ Profile បានទេ' });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // ២. Handler សម្រាប់ការបំពេញទិន្នន័យ Form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ៣. មុខងារបំប្លែងរូបភាពពីកុំព្យូទ័រទៅជា Base64 URL សម្រាប់ Cover Image
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // កំណត់ទំហំអតិបរមា 2MB
                setStatusMessage({ type: 'error', text: 'រូបភាពត្រូវតែមានទំហំតូចជាង 2MB' });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, cover_image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // ៤. រក្សាទុកទិន្នន័យ (Submit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatusMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_BASE_URL}/api/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                // Update username ក្នុង localStorage ប្រសិនបើមានការផ្លាស់ប្តូរ
                localStorage.setItem('username', formData.username);
                setStatusMessage({ type: 'success', text: 'រក្សាទុកទិន្នន័យ Profile បានជោគជ័យ!' });
            }
        } catch (error) {
            console.error("Update profile error:", error);
            const errorMsg = error.response?.data?.message || 'មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ';
            setStatusMessage({ type: 'error', text: errorMsg });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-4xl space-y-6 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">កំណត់ព័ត៌មានផ្ទាល់ខ្លួន រូបភាព Cover និងជំនាញរបស់អ្នក</p>
                </div>
            </div>

            {/* Notification Alert */}
            {statusMessage.text && (
                <div className={`flex items-center gap-2 rounded-lg p-4 text-sm font-medium ${
                    statusMessage.type === 'success' 
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                    {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                
                {/* 1. COVER IMAGE SECTION */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Cover Image</label>
                    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
                        {formData.cover_image ? (
                            <img src={formData.cover_image} alt="Cover Preview" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                មិនទាន់មានរូបភាព Cover
                            </div>
                        )}
                        <label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900/80 px-3 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-sm transition hover:bg-slate-900">
                            <Camera className="h-4 w-4" />
                            ប្តូររូប Cover
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* 2. USERNAME SECTION */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <User className="h-4 w-4 text-slate-500" />
                        Full Name / Username
                    </label>
                    <input 
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange}
                        required
                        placeholder="បញ្ចូលឈ្មោះរបស់អ្នក..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                </div>

                {/* 3. DESCRIPTION SECTION */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <FileText className="h-4 w-4 text-slate-500" />
                        Description / Bio
                    </label>
                    <textarea 
                        name="description" 
                        rows={4}
                        value={formData.description} 
                        onChange={handleChange}
                        placeholder="រៀបរាប់សង្ខេបអំពីខ្លួនអ្នក ឬបទពិសោធន៍ការងារ..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                </div>

                {/* 4. SKILLS SECTION */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <Wrench className="h-4 w-4 text-slate-500" />
                        Skills (បំបែកដោយសញ្ញាក្បៀស ",")
                    </label>
                    <input 
                        type="text" 
                        name="skills" 
                        value={formData.skills} 
                        onChange={handleChange}
                        placeholder="ឧទាហរណ៍៖ React, Node.js, Python, Automation"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                    {/* Skills Preview Badges */}
                    {formData.skills && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {formData.skills.split(',').map((skill, index) => skill.trim() && (
                                <span key={index} className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* SUBMIT BUTTON */}
                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                កំពុងរក្សាទុក...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                រក្សាទុកការផ្លាស់ប្តូរ
                            </>
                        )}
                    </button>
                </div>
            </form>
        </main>
    );
}

export default ProfileSettings;