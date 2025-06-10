import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import googlePlusIcon from '../../public/googlePlusIcon.png';
import './home.css';
import { getForms, deleteForm } from '../../api'; // getForm импорт хийсэн

export default function Home() {

  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("User");
        if (!storedUser) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);
        if (!user || !user.id) {
          setLoading(false);
          return;
        }
        
        // getForm функц ашиглаж байна
        const response = await getForms(user.id);
        if (response && response.data && response.data.forms) {
          setForms(response.data.forms);
        }
        
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        setLoading(false);
      }
    };
    const handleDelete = async (formId) => {
  try {
    await deleteForm(formId); // сервер рүү устгах хүсэлт явуулна
    setForms(prevForms => prevForms.filter(form => form._id !== formId)); // локал утгаас хасна
  } catch (error) {
    console.error("Delete error:", error);
  }
};
    useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="home-container">
      <div className="header">
        <h1>Start a new form</h1>
      </div>

      <div className="templates-container">
        <div className="template-card" onClick={() => navigate('/create')}>
          <div className="template-image-container">
            <img src={googlePlusIcon} alt="Blank Form Template" className="template-image" />
          </div>
          <p className="template-name">Blank form</p>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent forms</h2>
        <div className="recent-forms-container">
          {loading ? (
            <div className="data-message">
              <p>Loading...</p>
            </div>
          ) : forms.length > 0 ? (
            <div className="forms-grid">
              {forms.map(form => (
                <div 
                  key={form._id} 
                  className="form-card"
                >
                  <div className="form-card-content">
                    <h3>{form.title}</h3>

                    <div className='buttons-1'>
                      <button className='button-1' onClick={() => navigate(`/fill/${form._id}`)} >Fill</button>
                      <button className='button-2' onClick={() => navigate(`/responses/${form._id}`)} >Responses</button>
                      <button className='button-del' onClick={() => handleDelete(form._id)} >Delete</button>
                    </div>
                    <div className='buttons-2'>
                      <p className="form-date">
                        {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="data-message">
              <p>No Data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
