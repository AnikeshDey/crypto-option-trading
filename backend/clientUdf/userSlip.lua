local function rec_to_map(rec)
    local xrec = map()
    for i, bin_name in ipairs(record.bin_names(rec)) do
        xrec[bin_name] = rec[bin_name]
    end
    return xrec
 end
 
function slip_filter(stream, bin_name, filter_name, bin_name2, filter_name2, startValue, endValue)

    local function range_filter(rec)
       local counter = rec["spAS"]
       local val = rec[bin_name]
       local val2 = rec[bin_name2]
       if val == filter_name and ((counter >= startValue and counter <= endValue) or val2 == filter_name2) then
          return true
       else
          return false
       end
    end
    return stream:filter(range_filter):map(rec_to_map)
end

