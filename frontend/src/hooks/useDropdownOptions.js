import { useEffect, useState } from 'react';
import axios from 'axios';

const cache = new Map();
const API_BASE = 'http://localhost:4000/api';

export default function useDropdownOptions(type, params = {}) {
  const [options, setOptions] = useState(cache.get(type) || []);
  const [loading, setLoading] = useState(!cache.has(type));

  useEffect(() => {
    let ignore = false;
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const search = new URLSearchParams(params).toString();
        const url = search ? `${API_BASE}/dropdowns/${type}?${search}` : `${API_BASE}/dropdowns/${type}`;
        const response = await axios.get(url);
        if (!ignore) {
          cache.set(type, response.data || []);
          setOptions(response.data || []);
        }
      } catch (error) {
        console.error('Failed to load dropdown', type, error);
        if (!ignore) setOptions([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (!cache.has(type)) {
      fetchOptions();
    }

    return () => {
      ignore = true;
    };
  }, [type, JSON.stringify(params)]);

  return { options, loading };
}
