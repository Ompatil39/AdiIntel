# calcROI.py

def calculate_roi(gain, cost):
    """
    Calculate Return on Investment (ROI).
    ROI = (Gain from Investment - Cost of Investment) / Cost of Investment
    Returns ROI as a percentage.
    """
    if cost == 0:
        raise ValueError("Cost of investment cannot be zero.")
    roi = ((gain - cost) / cost) * 100
    return roi

def get_roi_data(gain, cost):
    """
    Wrapper to calculate ROI and return a dictionary.
    """
    roi_value = calculate_roi(gain, cost)
    return {"roi": roi_value}

# Example usage for integration with app.py
if __name__ == "__main__":
    # Example values
    gain = 1500
    cost = 1000
    roi_data = get_roi_data(gain, cost)
    print(roi_data)