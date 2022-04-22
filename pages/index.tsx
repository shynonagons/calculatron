import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { ThemeProvider } from '@emotion/react';
import theme from '@rebass/preset';
import { Input, Label, Select, Slider } from '@rebass/forms';
import { Button } from 'rebass';

type Job = {
  id: number;
  type: 'salary' | 'hourly';
  rate: number;
  weeklyHours?: number;
};

const Home: NextPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState<Job>();
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [weeksOff, setWeeksOff] = useState(4);
  const [healthCare, setHealthCare] = useState(0);

  useEffect(() => {
    setJobs([
      { id: 1, type: 'hourly', rate: 120, weeklyHours: 10 },
      { id: 2, type: 'hourly', rate: 160, weeklyHours: 10 },
    ]);
  }, []);

  const hourlyJobs = jobs.filter(({ type }) => type === 'hourly');
  const salaryJobs = jobs.filter(({ type }) => type === 'salary');

  const salaryTotal = salaryJobs.reduce((memo, { rate }) => memo + rate, 0);

  const weeklyTotal = Math.round(
    hourlyJobs.reduce((memo, { rate, weeklyHours = 0 }) => memo + rate * weeklyHours, 0) + salaryTotal / 52,
  );

  const monthlyTotal = Math.round(weeklyTotal * 4 + salaryTotal / 12);

  const yearlyTotal = weeklyTotal * (52 - weeksOff) + salaryTotal;

  const totalHours = hourlyJobs.reduce((total, { weeklyHours = 0 }) => total + weeklyHours, 0);

  const handleAddJob = () => {
    if (newJob) setJobs([...jobs, { ...newJob, id: jobs.length + 1 }]);
    setJobModalOpen(false);
  };

  const handleUpdateJob = (job: Job, field: keyof Job, value: number) => {
    const updatedJobIndex = jobs.findIndex(({ id }) => id === job.id);
    setJobs([
      ...jobs.slice(0, updatedJobIndex),
      { ...jobs[updatedJobIndex], [field]: value },
      ...jobs.slice(updatedJobIndex + 1),
    ]);
  };

  const handleNewJobFieldChange = ({ target: { id, value } }) => {
    const currentValues = newJob ?? {};
    setNewJob({ ...currentValues, [id]: value } as Job);
  };

  console.log(newJob);
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.container}>
        <Head>
          <title>Income Calculator</title>
          <meta name="description" content="Income calculator tool by shynonagons" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>Income Calculatron</h1>

          <div style={{ width: '60%' }}>
            {hourlyJobs.map((job) => (
              <>
                <Label>
                  Hourly job {job.id} ({job.weeklyHours} hours/wk @ ${job.rate}/hr)
                </Label>
                <div className={styles.row}>
                  <div className={styles.sliderIcon}>⏰</div>
                  <Slider
                    min={0}
                    max={120}
                    value={job.weeklyHours || 0}
                    onChange={({ target: { value } }) => handleUpdateJob(job, 'weeklyHours', parseInt(value, 10))}
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles.sliderIcon}>💰</div>
                  <Slider
                    min={0}
                    max={300}
                    value={job.rate || 0}
                    onChange={({ target: { value } }) => handleUpdateJob(job, 'rate', parseInt(value, 10))}
                  />
                </div>
              </>
            ))}

            <Label htmlFor="weeksOff">Weeks Off ({weeksOff})</Label>
            <div className={styles.row}>
              <div className={styles.sliderIcon}>🌴</div>
              <Slider
                id="weeksOff"
                min={0}
                max={52}
                value={weeksOff}
                onChange={({ target: { value } }) => setWeeksOff(parseInt(value, 10))}
              />
            </div>

            {/* <Label htmlFor="healthCare">Healthcare</Label>
            <Slider
              id="healthCare"
              min={0}
              max={10000}
              value={healthCare}
              onChange={({ target: { value } }) => setHealthCare(parseInt(value, 10))}
            /> */}
            <Button bg={'blue'} onClick={() => setJobModalOpen(true)}>
              Add job
            </Button>
            {jobModalOpen && (
              <div>
                <Label htmlFor="type">Job Type</Label>
                <Select id="type" name="type" onChange={handleNewJobFieldChange}>
                  <option key={'hourly'}>hourly</option>
                  <option key={'salary'}>salary</option>
                </Select>
                <Label htmlFor="rate">Hourly Rate / Salary</Label>
                <Input type="number" id="rate" name="rate" onChange={handleNewJobFieldChange} />
                <Label htmlFor="weeklyHours">Weekly Hours</Label>
                <Input type="number" id="weeklyHours" name="weeklyHours" onChange={handleNewJobFieldChange} />
                <Button bg="green" onClick={handleAddJob}>
                  Add
                </Button>
              </div>
            )}
          </div>

          <div className={styles.grid}>
            <div className={styles.card}>
              <h2>⏰ Total hours/week</h2>
              <p>{totalHours}</p>
            </div>
            <div className={styles.card}>
              <h2>🌴 Vacation (weeks)</h2>
              <p>{weeksOff}</p>
            </div>
          </div>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h2>Weekly income</h2>
              <p>${weeklyTotal}</p>
            </div>

            <div className={styles.card}>
              <h2>Monthly income</h2>
              <p>${monthlyTotal}</p>
            </div>

            <div className={styles.card}>
              <h2>Yearly income</h2>
              <p>${yearlyTotal}</p>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Made by shynonagons
            <span className={styles.logo}>
              {/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
            </span>
          </a>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Home;
