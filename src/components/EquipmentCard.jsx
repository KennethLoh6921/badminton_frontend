import { Link } from "react-router-dom";

const EquipmentCard = ({ equipment }) => {
    return (
        <div className="card">
            <div className="card-image">
                {equipment.eq_image ? (
                    <img src={equipment.eq_image} alt={equipment.eq_name} />
                ) : (
                    <div className="card-placeholder">🏸</div>
                )}
            </div>

            <div className="card-content">
                <h3 className="card-title">{equipment.eq_name}</h3>
                <p className="card-subtitle">Type: {equipment.eq_type}</p>
                {equipment.eq_brand && <p className="card-subtitle">Brand: {equipment.eq_brand}</p>}
                <p className="card-price">${equipment.eq_price}</p>

                {equipment.averageRating > 0 && (
                    <div className="card-rating">
                        <span>⭐ {equipment.averageRating.toFixed(1)}</span>
                        <span style={{ color: "var(--text-muted)" }}>({equipment.totalReviews} reviews)</span>
                    </div>
                )}

                <Link to={`/equipment/${equipment._id}`} className="btn btn-primary btn-sm">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default EquipmentCard;
