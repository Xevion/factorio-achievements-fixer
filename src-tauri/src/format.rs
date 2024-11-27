use humanize_duration::Unit;
use humanize_duration::{types::DurationParts, unit, Formatter, Truncate};

pub struct SlimFormatter;

unit!(MyYear, "y", "y");
unit!(MyMonth, "mon", "mon");
unit!(MyDay, "d", "d");
unit!(MyHour, "h", "h");
unit!(MyMinute, "m", "m");
unit!(MySecond, "s", "s");
unit!(MyMillis, "ms", "ms");
unit!(MyMicro, "mms", "mms");
unit!(MyNano, "ns", "ns");

impl Formatter for SlimFormatter {
    fn get(&self, truncate: Truncate) -> Box<dyn Unit> {
        match truncate {
            Truncate::Nano => Box::new(MyNano),
            Truncate::Micro => Box::new(MyMicro),
            Truncate::Millis => Box::new(MyMillis),
            Truncate::Second => Box::new(MySecond),
            Truncate::Minute => Box::new(MyMinute),
            Truncate::Hour => Box::new(MyHour),
            Truncate::Day => Box::new(MyDay),
            Truncate::Month => Box::new(MyMonth),
            Truncate::Year => Box::new(MyYear),
        }
    }

    fn format(
        &self,
        f: &mut std::fmt::Formatter<'_>,
        parts: DurationParts,
        truncate: Truncate,
    ) -> std::fmt::Result {
        self.format_default(f, parts, truncate)
    }
}
