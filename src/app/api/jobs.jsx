import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useDeleteJob = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`jobs/${data.id}`)
    .then((response) => response)
    .catch((error) => {
      throw error;
    }), {
    onSuccess: () => {
      queryClient.invalidateQueries('jobs');
    },
  });
};

const useFetchJobTypes = () => {
  const axios = useAxios();
  return useQuery(['schedules/jobs'], async () => {
    const response = await axios.get('schedules/jobs', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data.results;
  });
};

const useFetchSystemJobs = () => {
  const axios = useAxios();
  return useQuery(['schedules/triggers', 'system'], async () => {
    const response = await axios.get('schedules/triggers?jobType=system', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data.results;
  });
};

const useFetchUserJobs = () => {
  const axios = useAxios();
  return useQuery(['schedules/triggers'], async () => {
    const response = await axios.get('schedules/triggers', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data.results;
  });
};

const usePostJob = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('schedules/jobs', data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    }), {
    onSuccess: () => {
      queryClient.invalidateQueries('jobs');
    },
  });
};

const usePostOneTimeJob = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('schedules/triggers/one_time', data)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules/triggers', 'system']);
    },
  });
};

const usePutJob = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('schedules/jobs', data)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries('schedules/jobs');
    },
  });
};

export {
  useDeleteJob,
  useFetchJobTypes,
  useFetchSystemJobs,
  useFetchUserJobs,
  usePostJob,
  usePostOneTimeJob,
  usePutJob,
};
