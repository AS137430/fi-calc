// Specify possible spacing for the x-axis.
// This can be interpreted as meaning:
// the spacing between each tick can be 1 year, OR 2 years,
// OR 3 years, and so on, but never a value not in this list.
// For instance, there will never be 6 years between ticks.
//
// If/when I update this app to support months, then I would want
// to instead use multiples of 12 (i.e.; 12, 24, 36)
//
export default [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 50];
