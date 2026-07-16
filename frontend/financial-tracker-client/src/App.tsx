import Bucket from './components/Bucket'

const buckets = [
  { name: "Fixed Costs", percent: 55 },
  { name: "Investments", percent: 10 },
  { name: "Savings", percent: 8 },
  { name: "Guilt-Free Spending", percent: 27 },
];

function App() {
  return (
    <>
      <h1>Hello, this is my finance tracker</h1>
      <ul>
        <li>Track your spending</li>
        <li>Create your guilt-free spending plan</li>
      </ul>
      <ul>
        {buckets.map((bucket) => (
          <Bucket key={bucket.name} name={bucket.name} percent={bucket.percent} />

        ))}
      </ul>
    </>
  );
}

export default App