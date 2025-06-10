import React, { useState, useEffect} from 'react';
import styles from './ViewResponses.module.css';
import ResponseList from '../../components/ResponseList/ResponseList';
import { useParams } from 'react-router-dom';
import { getFormResponse } from '../../api'; // getForm импорт хийсэн


function ViewResponses() {
  const { formId } = useParams(); // ✅ зөв газар

  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await getFormResponse(formId); 
      if (!res) {
        setLoading(false);
        return;
      }
      setResponses(res); 
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [formId]); // formId өөрчлөгдөхөд дахин fetch хийнэ

  return (
    <div className={styles.container}>
      <h1>Form Responses</h1>
      <div className={styles.statsContainer}>
        <div className={styles.stat}>
          <h3>Total Responses</h3>
          <p>{responses.length}</p>
        </div>
      </div>
      <div className={styles.responsesList}>
        <ResponseList responses={responses} />
      </div>
    </div>
  );
}

export default ViewResponses; 