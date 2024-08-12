import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const headers = [
  'Sensory',
  'Music',
  'Food',
  'Fine Motor',
  'Gross Motor',
  'Social',
  'Free Play',
  'Academic',
  'Other',
];

const developmentSkills = [
  'Resilience',
  'Curiosity',
  'Communication',
  'Empathy',
  'Problem-solving',
];

const skillMappings = {
  Sensory: ['Resilience', 'Curiosity'],
  Music: ['Communication', 'Curiosity'],
  Food: ['Resilience', 'Problem-solving'],
  'Fine Motor': ['Problem-solving', 'Resilience'],
  'Gross Motor': ['Resilience', 'Communication'],
  Social: ['Empathy', 'Communication'],
  'Free Play': ['Curiosity', 'Problem-solving', 'Empathy'],
  Academic: ['Problem-solving', 'Curiosity', 'Communication'],
  Other: ['Resilience', 'Empathy', 'Communication'],
};

const assessmentGuidelines = {
  Sensory: [
    "Observe child's reaction to different textures during sensory play",
    'Note engagement level with various sensory materials',
    'Assess ability to describe sensory experiences verbally',
  ],
  Music: [
    'Evaluate rhythm-keeping abilities during musical activities',
    'Observe participation and creativity in music-making',
    'Note response to different genres and tempos of music',
  ],
  Food: [
    'Assess willingness to try new foods',
    'Observe fine motor skills during self-feeding',
    "Note child's ability to describe tastes and textures",
  ],
  'Fine Motor': [
    'Evaluate pencil grip and control during drawing activities',
    'Observe manipulation of small objects like beads or buttons',
    'Assess ability to use scissors or other fine motor tools',
  ],
  'Gross Motor': [
    'Observe balance and coordination during outdoor play',
    'Evaluate ability to navigate obstacle courses',
    'Assess participation in group movement activities',
  ],
  Social: [
    'Observe interactions with peers during free play',
    'Note ability to share and take turns',
    'Evaluate emotional regulation in social situations',
  ],
  'Free Play': [
    'Assess creativity and imagination in self-directed play',
    'Observe problem-solving approaches during play',
    'Note ability to sustain engagement in chosen activities',
  ],
  Academic: [
    'Evaluate interest in books and storytelling',
    'Observe recognition of letters, numbers, or shapes',
    'Assess ability to follow multi-step instructions',
  ],
  Other: [
    'Note any unique interests or talents',
    'Observe adaptability to new situations or challenges',
    'Assess overall enthusiasm for learning and exploration',
  ],
};

const calculateAge = (birthday) => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }

  return `${years} years, ${months} months`;
};

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};

const AssessmentForm = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [recentChanges, setRecentChanges] = useState({});
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentBirthday, setNewStudentBirthday] = useState('');
  const [newStudentInfo, setNewStudentInfo] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      setFormData(selectedStudent.assessmentData || {});
      setImagePreview(selectedStudent.image || null);
      setRecentChanges({});
    }
  }, [selectedStudent]);

  const handleStudentChange = (studentId) => {
    const student = students.find((s) => s.id === parseInt(studentId));
    setSelectedStudent(student);
    setEditMode(false);
  };

  const handleAssessmentChange = (header, value) => {
    const now = new Date().toISOString();
    setFormData((prevData) => {
      const previousValue = prevData[header]?.value;
      const newData = {
        ...prevData,
        [header]: {
          value,
          lastUpdated: now,
          previousValue: previousValue !== value ? previousValue : undefined,
          previousUpdateTime:
            previousValue !== value ? prevData[header]?.lastUpdated : undefined,
        },
      };
      if (previousValue !== value) {
        setRecentChanges((prev) => ({ ...prev, [header]: true }));
      }
      return newData;
    });
  };

  const handleOtherInputChange = (header, value) => {
    const now = new Date().toISOString();
    setFormData((prevData) => ({
      ...prevData,
      [header]: { ...prevData[header], otherValue: value, lastUpdated: now },
    }));
  };

  const handleSave = async () => {
    if (selectedStudent) {
      const updatedStudents = students.map((student) =>
        student.id === selectedStudent.id
          ? { ...student, assessmentData: formData, image: imagePreview }
          : student
      );
      setStudents(updatedStudents);
      setSelectedStudent({
        ...selectedStudent,
        assessmentData: formData,
        image: imagePreview,
      });
      
      try {
        await axios.post('/api/students', { students: updatedStudents });
        console.log('Saving data for', selectedStudent.name, formData);
        alert('Data saved successfully!');
      } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data. Please try again.');
      }
    }
  };

  const handleAddStudent = async () => {
    if (newStudentName && newStudentBirthday) {
      const newStudent = {
        id: Date.now(),
        name: newStudentName,
        birthday: newStudentBirthday,
        info: newStudentInfo,
      };
      const updatedStudents = [...students, newStudent];
      
      try {
        await axios.post('/api/students', { students: updatedStudents });
        setStudents(updatedStudents);
        setNewStudentName('');
        setNewStudentBirthday('');
        setNewStudentInfo('');
        alert('Student added successfully!');
      } catch (error) {
        console.error('Error adding student:', error);
        alert('Error adding student. Please try again.');
      }
    } else {
      alert('Please enter at least a name and birthday for the new student.');
    }
  };

  const handleRemoveStudent = async (id) => {
    const updatedStudents = students.filter(student => student.id !== id);
    
    try {
      await axios.post('/api/students', { students: updatedStudents });
      setStudents(updatedStudents);
      if (selectedStudent && selectedStudent.id === id) {
        setSelectedStudent(null);
      }
      alert('Student removed successfully!');
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Error removing student. Please try again.');
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleStudentInfoChange = (field, value) => {
    setSelectedStudent((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateStudent = () => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === selectedStudent.id ? selectedStudent : student
      )
    );
    setEditMode(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getDataForPieChart = () => {
    const counts = {
      Advanced: 0,
      'Age Appropriate': 0,
      'Needs Support': 0,
      Other: 0,
    };
    Object.values(formData).forEach((item) => {
      if (item.value) counts[item.value]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getDataForSpiderChart = () => {
    const skillScores = Object.fromEntries(
      developmentSkills.map((skill) => [skill, 0])
    );
    Object.entries(formData).forEach(([header, data]) => {
      if (skillMappings[header]) {
        const score =
          data.value === 'Advanced'
            ? 3
            : data.value === 'Age Appropriate'
            ? 2
            : data.value === 'Needs Support'
            ? 1
            : 0;
        skillMappings[header].forEach((skill) => {
          skillScores[skill] += score;
        });
      }
    });
    return Object.entries(skillScores).map(([skill, score]) => ({
      skill,
      score: score / 3, // Normalize the score
      recentChange: Object.keys(recentChanges).some(
        (header) =>
          skillMappings[header] && skillMappings[header].includes(skill)
      ),
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const RECENT_CHANGE_COLOR = '#FF0000';

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
        Comprehensive Early Childhood Assessment
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Add New Student</h2>
        <input
          type="text"
          placeholder="Student Name"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="date"
          value={newStudentBirthday}
          onChange={(e) => setNewStudentBirthday(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Additional Info"
          value={newStudentInfo}
          onChange={(e) => setNewStudentInfo(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleAddStudent}>Add Student</button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="student-select">Select Student: </label>
        <select
          id="student-select"
          onChange={(e) => handleStudentChange(e.target.value)}
          value={selectedStudent?.id || ''}
        >
          <option value="">Choose a student...</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      {selectedStudent && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {selectedStudent.name}
            <button onClick={handleEditToggle}>
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </h2>
          {editMode ? (
            <div>
              <input
                value={selectedStudent.name}
                onChange={(e) =>
                  handleStudentInfoChange('name', e.target.value)
                }
              />
              <input
                type="date"
                value={selectedStudent.birthday}
                onChange={(e) =>
                  handleStudentInfoChange('birthday', e.target.value)
                }
              />
              <input
                value={selectedStudent.info}
                onChange={(e) =>
                  handleStudentInfoChange('info', e.target.value)
                }
              />
              <button onClick={handleUpdateStudent}>Update</button>
            </div>
          ) : (
            <div>
              <p>
                <strong>Birthday:</strong>{' '}
                {formatDate(selectedStudent.birthday)}
              </p>
              <p>
                <strong>Age:</strong> {calculateAge(selectedStudent.birthday)}
              </p>
              <p>
                <strong>Info:</strong> {selectedStudent.info}
              </p>
            </div>
          )}
          <button onClick={() => handleRemoveStudent(selectedStudent.id)}>
            Remove Student
          </button>
        </div>
      )}

      {selectedStudent && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={{ width: '48%' }}>
              <h3>Overall Assessment</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={getDataForPieChart()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getDataForPieChart().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ width: '48%' }}>
              <h3>Development Profile</h3>
		          <ResponsiveContainer width="100%" height={200}>
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={getDataForSpiderChart()}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={30} domain={[0, 3]} />
                  <Radar
                    name="Skills"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            {headers.map((header) => (
              <div
                key={header}
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '5px',
                }}
              >
                <h3>{header}</h3>
                <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                  {assessmentGuidelines[header].map((guideline, index) => (
                    <li
                      key={index}
                      style={{ fontSize: '12px', marginBottom: '5px' }}
                    >
                      {guideline}
                    </li>
                  ))}
                </ul>
                <select
                  value={formData[header]?.value || ''}
                  onChange={(e) => handleAssessmentChange(header, e.target.value)}
                  style={{ width: '100%', marginBottom: '5px' }}
                >
                  <option value="">Select...</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Age Appropriate">Age Appropriate</option>
                  <option value="Needs Support">Needs Support</option>
                  <option value="Other">Other</option>
                </select>
                {formData[header]?.value === 'Other' && (
                  <input
                    type="text"
                    placeholder="Specify other..."
                    value={formData[header]?.otherValue || ''}
                    onChange={(e) => handleOtherInputChange(header, e.target.value)}
                    style={{ width: '100%', marginTop: '5px' }}
                  />
                )}
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Last updated:{' '}
                  {formData[header]?.lastUpdated
                    ? new Date(formData[header].lastUpdated).toLocaleString()
                    : 'Not yet updated'}
                </p>
                {formData[header]?.previousValue && (
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    Previous rating: {formData[header].previousValue}
                    (Changed:{' '}
                    {new Date(formData[header].previousUpdateTime).toLocaleString()}
                    )
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            style={{ marginBottom: '20px' }}
          >
            Save Assessment
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>
        Powered by UnconstrainED
      </div>
    </div>
  );
};

export default AssessmentForm;