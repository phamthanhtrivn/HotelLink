import { Slider } from "@/components/ui/slider";

const ScoreItem = ({ icon, label, value, onChange, disabled }) => {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {label}
        </span>
        <span className="text-sm font-semibold">{value}/10</span>
      </div>

      <Slider
        disabled={disabled}
        min={0}
        max={10}
        step={1}
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
};

export default ScoreItem;
