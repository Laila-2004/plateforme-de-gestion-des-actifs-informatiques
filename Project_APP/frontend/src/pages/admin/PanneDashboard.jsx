import PannePredictions from "../../components/analytics/PannePredictions";
import MaintenancePredictionDashboard from "../../components/analytics/MaintenancePredictionDashboard";
import HighRiskAssetsDashboard from "../../components/analytics/HighRiskAssetsDashboard";

export default function PanneDashboard(){
    return(
    //    < PannePredictions/>

        <div>
            <h1>Tableau de Bord des Prédictions de Pannes</h1>
            <HighRiskAssetsDashboard />
            <MaintenancePredictionDashboard />
            
        </div>
    )
}