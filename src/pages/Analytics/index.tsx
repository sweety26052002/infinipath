import AnalyticsDashboard from "../../components/AnalyticsDashboard";
import styles from "./index.module.scss";
const Analytics = () => {
    return (
        <div className={styles.analyticsDashboard} data-testid="analytics-dashboard">
        <AnalyticsDashboard/>
        </div>
    );
}
export default Analytics;