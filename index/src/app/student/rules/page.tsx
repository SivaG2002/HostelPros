import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

export default function StudentRulesPage() {
  const hostelRules = [
    "Students must return to the hostel before 9:30 PM.",
    "Silence must be maintained after 10:00 PM.",
    "Visitors are not allowed inside rooms without prior permission.",
    "Damage to hostel property will result in fines.",
    "Rooms and common areas must be kept clean.",
    "Cooking inside rooms is strictly prohibited.",
    "Consumption of alcohol or illegal substances is strictly forbidden.",
    "Electrical appliances must be approved by hostel administration.",
    "Students must carry ID cards at all times.",
    "Misconduct may lead to suspension from hostel facilities."
  ];

  const feeRules = [
    "Hostel fees must be paid before the due date.",
    "Late payment will attract penalty charges.",
    "Continuous non-payment may lead to room cancellation.",
    "Fee receipts must be preserved for verification.",
    "Refunds (if applicable) will be processed within 30 working days.",
    "Partial payments are allowed only with admin approval.",
    "Online payment confirmation must be uploaded if requested."
  ];

  const foodCourtRules = [
    "Food court timings must be strictly followed.",
    "Wastage of food is strictly prohibited.",
    "Students must maintain cleanliness in dining areas.",
    "Outside food delivery inside hostel premises is restricted.",
    "Queue discipline must be maintained during meal hours.",
    "Utensils must not be taken outside the dining hall.",
    "Complaints regarding food must be reported immediately."
  ];

  return (
    <div className="space-y-6">
      
      {/* Hostel Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-primary" />
            Hostel Rules & Regulations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 list-decimal list-inside">
            {hostelRules.map((rule, index) => (
              <li key={index} className="text-sm leading-relaxed">
                {rule}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Fee Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Payment Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 list-decimal list-inside">
            {feeRules.map((rule, index) => (
              <li key={index} className="text-sm leading-relaxed">
                {rule}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Food Court Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Food Court Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 list-decimal list-inside">
            {foodCourtRules.map((rule, index) => (
              <li key={index} className="text-sm leading-relaxed">
                {rule}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

    </div>
  );
}
